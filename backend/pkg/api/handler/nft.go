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

func NFTRoutes(r *mux.Router, db *gorm.DB) {
	r.HandleFunc("/moralisNft/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { FetchNFTHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { GetNFTHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/nft/count/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { GetNFTCountbyWalletHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/listing/{isListing}", func(w http.ResponseWriter, r *http.Request) { GetNFTbyIsListingHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/listings/{walletAddress}", func(w http.ResponseWriter, r *http.Request) { GetListingsbyWalletHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/nft/{nftId}", func(w http.ResponseWriter, r *http.Request) { GetNFTByIdHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/collection/{tokenAddress}", func(w http.ResponseWriter, r *http.Request) { GetNFTByTokenAddressHandler(w, r, db) }).Methods("GET")
	r.HandleFunc("/dbNft/{nftId}", func(w http.ResponseWriter, r *http.Request) { UpdateNFTHandler(w, r, db) }).Methods("PUT", "PATCH")
	r.HandleFunc("/dbNft", func(w http.ResponseWriter, r *http.Request) { CreateNFTHandler(w, r, db) }).Methods("POST")
	r.HandleFunc("/dbNft", func(w http.ResponseWriter, r *http.Request) { GetNFTsHandler(w, r, db) }).Methods("GET")
}

func CreateNFTHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var nft model.NFT
	if err := json.NewDecoder(r.Body).Decode(&nft); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err := service.CreateNFT(&nft, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(nft)
}

func GetNFTsHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	nfts, err := service.GetAllNFTs(db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func GetNFTHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	nfts, err := service.GetNFTswithWalletAddress(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func GetNFTByIdHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	nftId := vars["nftId"]
	nft, err := service.GetNFTwithNftId(nftId, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nft)
}

func GetNFTByTokenAddressHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	tokenAddress := vars["tokenAddress"]
	nfts, err := service.GetNFTwithNftTokenAddress(tokenAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func GetNFTbyIsListingHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	isListing := vars["isListing"]
	isListingBool, err := strconv.ParseBool(isListing)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	nfts, err := service.GetNFTbyIsListing(isListingBool, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func GetListingsbyWalletHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	nfts, err := service.GetAllListingsbyWallet(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func GetNFTCountbyWalletHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	nfts, err := service.GetNFTCountbyWallet(walletAddress, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(nfts)
}

func UpdateNFTHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	nftId := vars["nftId"]
	var nft model.NFT
	if err := json.NewDecoder(r.Body).Decode(&nft); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err := service.UpdateNFT(nftId, &nft, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(nft)
}

func FetchNFTHandler(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	walletAddress := vars["walletAddress"]
	apiKey := "API_KEY"

	data, err := service.FetchNFTData(walletAddress, apiKey, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}
