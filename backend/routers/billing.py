from fastapi import APIRouter
router = APIRouter()
@router.post('/checkout')
def create_checkout(): pass
@router.post('/webhook')
def stripe_webhook(): pass
@router.get('/subscription')
def get_subscription(): pass
@router.get('/usage')
def get_usage(): pass
