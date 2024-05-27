package handler

import (
	"Avax-NFT-Marketplace/model"
	"Avax-NFT-Marketplace/pkg/service"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func CollectionRoutes(r *mux.Router, db *gorm.DB) {
	r.HandleFunc("/moralisCollection/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { FetchCollectionsHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/collection", func(w http.ResponseWriter, r *http.Request) { CreateCollectionHandler(w, r, db) }).Methods("POST")
	r.HandleFunc("/collection", func(w http.ResponseWriter, r *http.Request) { GetAllCollectionsHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/collection/creators", func(w http.ResponseWriter, r *http.Request) { GetAllCreatorsHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/collection/wallet/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { GetAllCollectionsbyWalletHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/collection/{tokenAddress}", func(w http.ResponseWriter, r *http.Request) { GetCollectionbyTokenAddressHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/collection/{tokenAddress}", func(w http.ResponseWriter, r *http.Request) { UpdateCollectionHandler(w, r, db) }).Methods("PUT")
	r.HandleFunc("/collection/{tokenAddress}", func(w http.ResponseWriter, r *http.Request) { DeleteCollectionHandler(w, r, db) }).Methods("DELETE")
}

func CreateCollectionHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var collection model.Collection
	if err := json.NewDecoder(r.Body).Decode(&collection); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err := service.CreateCollection(&collection, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(collection)
}

func GetAllCollectionsHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	collections, err := service.GetAllCollections(db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(collections)
}

func GetAllCreatorsHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	collections, err := service.GetAllCreators(db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(collections)
}

func GetAllCollectionsbyWalletHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	collection, err := service.GetAllCollectionsbyWallet(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(collection)
}

func GetCollectionbyTokenAddressHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	tokenAddress := vars["tokenAddress"]
	collection, err := service.GetCollectionbyTokenAddress(tokenAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(collection)
}

func UpdateCollectionHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	tokenAddress := vars["tokenAddress"]
	var collection model.Collection
	if err := json.NewDecoder(r.Body).Decode(&collection); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err := service.UpdateCollection(tokenAddress, &collection, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(collection)
}

func DeleteCollectionHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	tokenAddress := vars["tokenAddress"]
	err := service.DeleteCollection(tokenAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func FetchCollectionsHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	apiKey := "API_KEY"

	data, err := service.FetchCollectionsData(walletAddress, apiKey, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}
