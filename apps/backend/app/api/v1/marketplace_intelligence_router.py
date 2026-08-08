from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.marketplace_intelligence import (
    ItemCategory,
    ItemSubmissionRequest,
    MarketplaceAnalyticsModel,
    MarketplaceItemDetailModel,
    MarketplaceScorecardModel,
    OrgApprovalRecordModel,
    RatingReviewItemModel,
    RatingReviewSubmissionRequest,
    RevenueReportModel,
)
from app.services.marketplace_intelligence_service import MarketplaceIntelligenceService

router = APIRouter(prefix="/marketplace-intelligence", tags=["Intelligence Marketplace"])


# ----------------------------------------------------
# Catalog Browsing & Submission
# ----------------------------------------------------
@router.get(
    "/items",
    response_model=List[MarketplaceItemDetailModel],
    status_code=status.HTTP_200_OK,
)
def get_marketplace_items(
    category: Optional[ItemCategory] = None,
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.get_marketplace_items(category)


@router.post(
    "/submit",
    response_model=MarketplaceItemDetailModel,
    status_code=status.HTTP_201_CREATED,
)
def submit_marketplace_item(
    req: ItemSubmissionRequest,
    publisher_email: str = Query("publisher@acme.com"),
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.submit_marketplace_item(req, publisher_email)


# ----------------------------------------------------
# Ratings, Reviews & Org Approvals
# ----------------------------------------------------
@router.post(
    "/review",
    response_model=RatingReviewItemModel,
    status_code=status.HTTP_201_CREATED,
)
def submit_rating_review(
    req: RatingReviewSubmissionRequest,
    reviewer_email: str = Query("reviewer@acme.com"),
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.submit_rating_review(req, reviewer_email)


@router.get(
    "/approvals/{organization_id}",
    response_model=List[OrgApprovalRecordModel],
    status_code=status.HTTP_200_OK,
)
def get_org_approvals(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.get_org_approvals(organization_id)


# ----------------------------------------------------
# Revenue & Analytics
# ----------------------------------------------------
@router.get(
    "/revenue/{publisher_id}",
    response_model=RevenueReportModel,
    status_code=status.HTTP_200_OK,
)
def get_revenue_report(
    publisher_id: str,
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.get_revenue_report(publisher_id)


@router.get(
    "/analytics/{item_id}",
    response_model=MarketplaceAnalyticsModel,
    status_code=status.HTTP_200_OK,
)
def get_marketplace_analytics(
    item_id: str,
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.get_marketplace_analytics(item_id)


# ----------------------------------------------------
# Scorecard (Phase Completion)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=MarketplaceScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_marketplace_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = MarketplaceIntelligenceService(db=db)
    return service.get_marketplace_scorecard(organization_id)
