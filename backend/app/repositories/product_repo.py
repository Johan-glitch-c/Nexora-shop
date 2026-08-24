from ..schemas.product import ProductCreateSchema
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

    def get_mupltipale_by_id(self, category_id: int) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.category_id==category_id).all()