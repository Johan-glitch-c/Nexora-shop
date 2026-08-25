from typing import List
from sqlalchemy.orm import Session
from ..schemas.product import ProductListResponseSchema, ProductResponseSchema, ProductCreateSchema, ProductUpdateSchema
from ..repositories.product_repo import ProductRepository
from fastapi import HTTPException, status
from ..repositories.cateogry_repo import CategoryRepository

class ProductService:
    def __init__(self, db: Session):
        self.product_repo = ProductRepository(db)
        self.category_repo = CategoryRepository(db)

    def get_all_products(self)-> List[ProductResponseSchema]:
        products = self.product_repo.get_all()
        products_response=[ProductResponseSchema.model_validate(product) for product in products]
        return ProductListResponseSchema(products=products_response, total=len(products_response))

    def get_product_by_id(self, product_id: int) -> ProductResponseSchema:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return ProductResponseSchema.model_validate(product)

    def get_products_by_category(self, category_id: int) -> List[ProductResponseSchema]:
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        products = self.product_repo.get_by_category(category.id)
        products_response=[ProductResponseSchema.model_validate(product) for product in products]
        return ProductListResponseSchema(products=products_response, total=len(products_response))

    def create_product(self, product_data: ProductCreateSchema) -> ProductResponseSchema:
        category=self.category_repo.get_by_id(product_data.category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        product = self.product_repo.create(product_data)
        return ProductResponseSchema.model_validate(product)

    def delete_product(self, product_id: int) -> bool:
        deleted = self.product_repo.delete(product_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Product not found",)
        return True

    def update_product(self, product_id: int, product_data: ProductUpdateSchema) -> ProductResponseSchema:
        category=self.category_repo.get_by_id(product_data.category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        product = self.product_repo.update(product_id, product_data)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return ProductResponseSchema.model_validate(product)