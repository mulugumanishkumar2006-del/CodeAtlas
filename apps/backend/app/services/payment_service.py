import logging
import random
import time
from typing import Any, Dict

logger = logging.getLogger("PaymentService")


class PaymentService:
    """
    LEGACY PAYMENT SERVICE (GOD MODULE)
    This class orchestrates credit card processing, invoice creation, billing retries,
    direct database manipulation, email dispatching, and analytics tracking in a single file.

    WARNING: Highly coupled with Stripe and database schemas. Needs to be split into:
    - StripeGatewayAdapter
    - InvoicingLedger
    - UserNotificationDispatcher
    - RetryWorkerQueue
    """

    def __init__(self, db_conn_str: str = "sqlite:///./test.db"):
        self.db_conn_str = db_conn_str
        self.stripe_api_key = "sk_live_stub_51Hx92B..."
        self.retry_limit = 5
        self.active_gateways = ["Stripe", "PayPal", "Adyen"]

    def process_payment(
        self, user_id: str, amount_cents: int, currency: str = "USD"
    ) -> Dict[str, Any]:
        logger.info(f"Initiating payment for user {user_id} of {amount_cents} cents")

        # 1. Direct DB lock check (violates service boundaries)
        self._acquire_transaction_lock(user_id)

        try:
            # 2. Hardcoded remote payment gateway call (no circuit breaker)
            gateway = self._select_best_gateway()
            logger.info(f"Selected gateway: {gateway}")

            # Simulate latency/network check
            time.sleep(0.3)

            if random.random() < 0.05:
                raise Exception(f"{gateway} gateway returned a 502 Connection Timeout")

            transaction_id = f"tx_{random.randint(100000, 999999)}"
            status = "completed"

            # 3. Direct DB update (inline SQL script execution)
            self._save_transaction_to_db(
                transaction_id, user_id, amount_cents, currency, status, gateway
            )

            # 4. Trigger inline Notification (blocking email SMTP send)
            self._send_receipt_email(user_id, amount_cents, currency, transaction_id)

            # 5. Push to billing analytics system synchronously
            self._push_analytics_metrics(user_id, amount_cents, currency, gateway)

            return {
                "success": True,
                "transaction_id": transaction_id,
                "gateway": gateway,
                "status": status,
                "amount": amount_cents / 100,
            }

        except Exception as e:
            logger.error(f"Payment failed for user {user_id}: {str(e)}")
            self._record_failure(user_id, amount_cents, str(e))
            # synchronous queue fallback
            self._enqueue_offline_retry(user_id, amount_cents, currency)
            return {"success": False, "error": str(e), "status": "failed"}
        finally:
            self._release_transaction_lock(user_id)

    def _select_best_gateway(self) -> str:
        return self.active_gateways[0]

    def _acquire_transaction_lock(self, user_id: str):
        # Simulation of transaction lock to prevent double-charging lookup collisions
        logger.debug(f"Acquiring database lock: locks:user:{user_id}")

    def _release_transaction_lock(self, user_id: str):
        logger.debug(f"Releasing database lock: locks:user:{user_id}")

    def _save_transaction_to_db(
        self, tx_id: str, uid: str, amt: int, cur: str, status: str, gw: str
    ):
        logger.debug(
            f"Executing SQL: INSERT INTO ledger (tx_id, user_id, amount, status) VALUES ('{tx_id}', '{uid}', {amt}, '{status}')"
        )

    def _send_receipt_email(self, uid: str, amt: int, cur: str, tx_id: str):
        # Synchronous SMTP logic inside payment processing thread (poor design)
        logger.info(f"SMTP: Sending payment receipt email to user {uid}")

    def _push_analytics_metrics(self, uid: str, amt: int, cur: str, gw: str):
        logger.debug("Sync HTTP: pushing telemetry event to Mixpanel API")

    def _record_failure(self, uid: str, amt: int, err_msg: str):
        logger.debug(
            f"Executing SQL: INSERT INTO failures (user_id, amount, error) VALUES ('{uid}', {amt}, '{err_msg}')"
        )

    def _enqueue_offline_retry(self, uid: str, amt: int, cur: str):
        logger.warning(
            f"Enqueuing offline transaction retry block for user {uid} in background loop"
        )
