from ..repositories.cateogry_repo import CategoryRepository
from ..schemas.category import CategoryResponseSchema, CategoryCreateSchema, CategoryUpdateSchema
from fastapi import HTTPException, status
from typing import List
from sqlalchemy.orm import Session


class CategoryService:
    def __init__(self, db: Session):
        self.repository = CategoryRepository(db)

    def get_all_categories(self) -> List[CategoryResponseSchema]:
        categories = self.repository.get_all()
        return [CategoryResponseSchema.model_validate(cat) for cat in categories]

    def get_category_by_id(self,category_id: int) -> CategoryResponseSchema:
        category=self.repository.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category id not found")
        return CategoryResponseSchema.model_validate(category)

    def create_category(self, category_data: CategoryCreateSchema) -> CategoryResponseSchema:
        existing_category = self.repository.get_by_slug(category_data.slug)
        if not existing_category:
            category = self.repository.create(category_data)
            return CategoryResponseSchema.model_validate(category)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category already exists")

    def update_category(self,category_id: int, category_data: CategoryUpdateSchema) -> CategoryResponseSchema:
        category=self.repository.update(category_id,category_data)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category id not found")
        return CategoryResponseSchema.model_validate(category)

    def delete_category(self,category_id: int) -> bool:
        category=self.repository.delete(category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category id not found")
        return True