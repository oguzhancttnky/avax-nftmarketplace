package main

import (
	"Avax-NFT-Marketplace/model"
	"Avax-NFT-Marketplace/pkg/api/handler"
	"fmt"
	"log"
	"net/http"
	"os"

	//"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// .env dosyasını yükle
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Çevre değişkenlerinden veritabanı bağlantı bilgilerini al
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Veritabanı bağlantı dizesini oluştur
	psqlInfo := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
		host, user, password, dbname, port)

	// Burada Database'i SQL ile açmışsın GORM'a geçtim PostgreSQL ile açtım
	db, err := gorm.Open(postgres.Open(psqlInfo), &gorm.Config{})
	if err != nil {
		fmt.Println("Hata!!")
		return
	}

	err = db.AutoMigrate(&model.User{})
	if err != nil {
		fmt.Println("Failed to auto migrate: ", err)
	}

	err = db.AutoMigrate(&model.NFT{})
	if err != nil {
		fmt.Println("Failed to auto migrate: ", err)
	}

	err = db.AutoMigrate(&model.Collection{})
	if err != nil {
		fmt.Println("Failed to auto migrate: ", err)
	}

	// Burada model klasöründe oluşturduğum user modelini table olarak ekledim Bir kere çalıştırmak için yoruma aldım yorumda kalsın

	// Router bağlantısı yapıyoruz. Netten araştırdım mux gorillayı buldum buna sen de bakailirsin başka bir şey var mı
	router := mux.NewRouter()

	// CORS middleware konfigürasyonu
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	// routes
	handler.UserRoutes(router, db)
	handler.NFTRoutes(router, db)
	handler.CollectionRoutes(router, db)
	// Apply CORS settings to all routes
	http.ListenAndServe(":8080", corsHandler(router))

}
