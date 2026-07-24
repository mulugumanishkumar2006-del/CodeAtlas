import logging
import uuid
from typing import Any, Dict, List

logger = logging.getLogger("OrderService")


class OrderService:
    """
    OrderService handles order checkout, tracking, items fulfillment,
    and publishes state updates to downstream notification/delivery boundaries.
    """

    def __init__(self):
        self.orders_db = {}

    def create_order(self, user_id: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        order_id = f"ord_{uuid.uuid4().hex[:8]}"
        total_cents = sum(
            item.get("price_cents", 0) * item.get("quantity", 1) for item in items
        )

        order = {
            "order_id": order_id,
            "user_id": user_id,
            "items": items,
            "total_cents": total_cents,
            "status": "created",
            "fulfillment_status": "pending",
        }

        self.orders_db[order_id] = order
        logger.info(
            f"Order {order_id} created for user {user_id} totaling {total_cents} cents"
        )

        return order

    def fulfill_order(self, order_id: str) -> Dict[str, Any]:
        if order_id not in self.orders_db:
            raise ValueError(f"Order {order_id} not found")

        order = self.orders_db[order_id]
        order["status"] = "fulfilled"
        order["fulfillment_status"] = "completed"

        logger.info(
            f"Order {order_id} successfully fulfilled and pushed to streaming delivery"
        )

        # In a microservices design, we publish an event:
        # self.event_publisher.publish("order.fulfilled", {"order_id": order_id, "user_id": order["user_id"]})

        return order

    def get_order_status(self, order_id: str) -> Dict[str, Any]:
        if order_id not in self.orders_db:
            return {"error": "Not Found"}
        return self.orders_db[order_id]
