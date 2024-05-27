package handler

import (
	"Avax-NFT-Marketplace/model"
	"Avax-NFT-Marketplace/pkg/service"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// Burada Endpointler için ilgili routerları
// oluşturuyoruz yani istek attığımız adresleri
// yazıp istek içeriğini yazıyoruz ve istek
// içeriğini kontrol ediyoruz. Bundan dolayı
// Handler alanı diye geçiyor request lerin
// valid olup olmadıklarını kontrol ediyoruz

// İlk olarak user ile ilişkili router lar için bir fonksiyon tanımlıyoruz
func UserRoutes(r *mux.Router, db *gorm.DB) {
	r.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) { CreateUserHandler(w, r, db) }).Methods("POST")
	r.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) { GetAllUsersHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/users/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { GetUserByWalletAddressHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/users/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { UpdateUserHandler(w, r, db) }).Methods("PUT")
	r.HandleFunc("/users/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { DeleteUserHandler(w, r, db) }).Methods("DELETE")
}

// Yeni Bir Kullanıcı Oluştur
func CreateUserHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Burada Service kodunu çağırıyoruz
	err := service.CreateUser(&user, db)
	if err != nil {
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// Kullanıcıyı Wallet Adresine Göre Getir
func GetUserByWalletAddressHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	user, err := service.GetUserByWalletAddress(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

// Kullanıcıyı ID'ye Göre Getir
func GetUserByIDHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	// HTTP string olarak alıyor
	id, err := strconv.ParseUint(vars["id"], 10, 32) // string'i uint'e çeviriyoruz
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	user, err := service.GetUserByID(uint(id), db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

// Tüm Kullanıcıları Getir
func GetAllUsersHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	users, err := service.GetAllUsers(db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(users)
}

// Kullanıcıyı Wallet Adresine Göre Güncelle
func UpdateUserHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err := service.UpdateUser(walletAddress, &user, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// Kullanıcıyı Wallet Adresine Göre Sil
func DeleteUserHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	err := service.DeleteUser(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
