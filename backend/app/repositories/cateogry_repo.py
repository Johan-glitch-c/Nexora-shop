from ..schemas.category import  CategoryCreateSchema
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