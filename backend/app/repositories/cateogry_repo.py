from ..schemas.category import  CategoryCreateSchema, CategoryResponseSchema, CategoryUpdateSchema
from sqlalchemy.orm import Session
from ..models.category import Category
from typing import Optional, List


class CategoryRepository:

    def __init__(self, db: Session):
        self.db = db


    def get_all(self,) -> List[Category]:
        return self.db.query(Category).all()


    def get_by_id(self, category_id: int)->Optional[Category]:
        return self.db.query(Category).filter(Category.id==category_id).first()

    def get_by_slug(self, category_slug: str)->Optional[Category]:
        return self.db.query(Category).filter(Category.slug==category_slug).first()

    def create(self, category_data: CategoryCreateSchema) -> Category:
        db_category = Category(**category_data.model_dump())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update(self, category_id: int, category_data: CategoryUpdateSchema) -> Optional[Category]:
        existing_category = self.db.query(Category).filter(Category.id==category_id).first()
        if not existing_category:
            return None
        existing_category.name = category_data.name
        existing_category.slug = category_data.slug
        self.db.commit()
        self.db.refresh(existing_category)
        return existing_category

    def delete(self,category_id: int) ->Optional[Category]:
        existing_category = self.db.query(Category).filter(Category.id==category_id).first()
        if not existing_category:
            return None
        self.db.delete(existing_category)
        self.db.commit()
        return True