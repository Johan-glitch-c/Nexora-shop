from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Nexora Shop"
    debug: bool = True
    database_url: str = "sqlite:///Nexora.db"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
