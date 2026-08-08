import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class MarketplaceItemDBModel(Base):
    __tablename__ = "mp_items"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)  # AGENT, TOOL, PLUGIN, WORKFLOW, INTEGRATION
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    publisher_id = Column(String, index=True, nullable=False)
    publisher_name = Column(String, nullable=False)
    current_version = Column(String, default="v1.0.0")
    security_verified = Column(Boolean, default=True)
    downloads_count = Column(Integer, default=0)
    avg_rating = Column(Float, default=5.0)
    pricing_model = Column(String, default="FREE")  # FREE, PAID_PER_EXECUTION, SUBSCRIPTION
    price_usd = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ItemVersionDBModel(Base):
    __tablename__ = "mp_item_versions"

    id = Column(String, primary_key=True, index=True)
    item_id = Column(String, index=True, nullable=False)
    version = Column(String, nullable=False)
    changelog = Column(Text, nullable=False)
    manifest_hash = Column(String, nullable=False)
    security_scan_status = Column(String, default="PASSED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ItemRatingReviewDBModel(Base):
    __tablename__ = "mp_ratings_reviews"

    id = Column(String, primary_key=True, index=True)
    item_id = Column(String, index=True, nullable=False)
    reviewer_email = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    review_title = Column(String, nullable=True)
    review_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OrgApprovalPolicyDBModel(Base):
    __tablename__ = "mp_org_approvals"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    item_id = Column(String, index=True, nullable=False)
    approval_status = Column(String, default="APPROVED")  # PENDING, APPROVED, REJECTED, RESTRICTED
    approved_by = Column(String, nullable=False)
    approved_at = Column(DateTime, default=datetime.datetime.utcnow)


class MarketplaceAnalyticsDBModel(Base):
    __tablename__ = "mp_analytics"

    id = Column(String, primary_key=True, index=True)
    item_id = Column(String, index=True, nullable=False)
    total_executions = Column(Integer, default=0)
    successful_executions = Column(Integer, default=0)
    failed_executions = Column(Integer, default=0)
    avg_latency_ms = Column(Float, default=15.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class RevenueUsageDBModel(Base):
    __tablename__ = "mp_revenue"

    id = Column(String, primary_key=True, index=True)
    publisher_id = Column(String, index=True, nullable=False)
    item_id = Column(String, index=True, nullable=False)
    organization_id = Column(String, index=True, nullable=False)
    amount_usd = Column(Float, default=0.0)
    usage_units = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class PublisherProfileDBModel(Base):
    __tablename__ = "mp_publishers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    verified = Column(Boolean, default=True)
    payout_account_status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
