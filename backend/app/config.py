from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Nexora Shop"
    debug: bool = True
    database_url: str = "sqlite:///Nexora.db"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        'http://localhost:8000',
    ]
    static_url: str = "/static"
    images_dir: str = "/static/images"

    class Config:
        env_file = ".env"

settings = Settings()
