from fastapi import APIRouter, status, Depends
from ..services.product import ProductService
from ..database import get_db
from sqlalchemy.orm import Session
from ..schemas.product import ProductUpdateSchema, ProductCreateSchema, ProductResponseSchema, ProductListResponseSchema

router = APIRouter(prefix="/api/product",tags=["product"])

@router.get("/",response_model=ProductListResponseSchema, status_code=status.HTTP_200_OK)
def get_all_products(db: Session = Depends(get_db)):
    service=ProductService(db)
    return service.get_all_products()

@router.get("/category/",response_model=ProductListResponseSchema, status_code=status.HTTP_200_OK)
def get_product_by_category(category_id: int, db: Session = Depends(get_db)):
    service=ProductService(db)
    return service.get_products_by_category(category_id)

@router.get("/{product_id}",response_model=ProductResponseSchema, status_code=status.HTTP_200_OK)
def get_product(product_id: int, db: Session = Depends(get_db)):
    service=ProductService(db)
    return service.get_product_by_id(product_id)

@router.post("/",response_model=ProductResponseSchema, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreateSchema, db: Session = Depends(get_db)):
    service=ProductService(db)
    return service.create_product(product)

@router.put("/{product_id}",response_model=ProductResponseSchema, status_code=status.HTTP_200_OK)
def update_product(product_id: int, product_data: ProductUpdateSchema, db: Session = Depends(get_db)):
    service=ProductService(db)
    return service.update_product(product_id, product_data)

@router.delete("/{product_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    service=ProductService(db)
    service.delete_product(product_id)