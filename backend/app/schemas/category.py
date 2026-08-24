from pydantic import BaseModel, Field


class CategorySchema(BaseModel):
    id: int
    name: str = Field(..., min_length=5, max_length=100, description="Category name")
    slug: str = Field(..., min_length=5, max_length=100, description="Category slug")

class CategoryCreateSchema(CategorySchema):
    pass


class CategoryResponseSchema(CategorySchema):
    id: int = Field(..., description="The unique id of the category")

    class Config:
        from_attributes=True