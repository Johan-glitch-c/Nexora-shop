from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends,status
from ..database import get_db
from ..services.category import CategoryService
from typing import List
from ..schemas.category import CategoryResponseSchema, CategoryCreateSchema, CategoryUpdateSchema
from ..models.user import User
from ..security.auth import require_admin

router = APIRouter(prefix='/api/category',tags=["Categories"])



@router.get("/",response_model=List[CategoryResponseSchema],status_code=status.HTTP_200_OK)
def get_categories(db: Session = Depends(get_db)):
    service = CategoryService(db)
    return service.get_all_categories()

@router.get("/{category_id}",response_model=CategoryResponseSchema,status_code=status.HTTP_200_OK)
def get_category_by_id(category_id: int,db: Session = Depends(get_db)):
    service = CategoryService(db)
    return service.get_category_by_id(category_id)

@router.post("/",response_model=CategoryResponseSchema,status_code=status.HTTP_201_CREATED)
def create_category(category_data: CategoryCreateSchema,current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    service= CategoryService(db)
    return service.create_category(category_data)

@router.put("/{category_id}",response_model=CategoryResponseSchema,status_code=status.HTTP_200_OK)
def update_category(category_id: int,category_data: CategoryUpdateSchema,current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    service = CategoryService(db)
    return service.update_category(category_id, category_data)


@router.delete("/{category_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int,current_user: User = Depends(require_admin),db: Session = Depends(get_db)):
    service = CategoryService(db)
    service.delete_category(category_id)