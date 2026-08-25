from ..schemas.product import ProductCreateSchema, ProductUpdateSchema
from ..models import Product
from typing import List, Optional
from sqlalchemy.orm import joinedload, Session

class ProductRepository:

    def __init__(self, db: Session):
        self.db = db


    def get_all(self) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).all()

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()

    def get_by_category(self, category_id: int) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.category_id==category_id).all()

    def create(self, product_data: ProductCreateSchema) -> Product:
        db_product = Product(**product_data.model_dump())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def update(self,product_id: int, product_data: ProductUpdateSchema) -> Product:
        existing_product = self.db.query(Product).filter(Product.id == product_id).first()
        if existing_product:
            existing_product.name = product_data.name
            existing_product.price = product_data.price
            existing_product.category_id = product_data.category_id
            existing_product.image_url = product_data.image_url
            existing_product.description = product_data.description
            self.db.commit()
            self.db.refresh(existing_product)
            return existing_product
        raise Exception ("Product not found.")

    def delete(self, product_id: int) -> Optional[bool]:
        existing_product = self.db.query(Product).filter(Product.id == product_id).first()
        if not existing_product:
            return None
        self.db.delete(existing_product)
        self.db.commit()
        return True