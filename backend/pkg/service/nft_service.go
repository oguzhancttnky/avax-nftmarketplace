package service

/*
Burada Yaptığımız Handler ile gelen ve
düzeltilmiş HTTP isteğini kendi kodumuzda maniple etmek.
Burada DB e bağlanıp oradan çeşitli işlemler yapacağız.
*/

import (
	"Avax-NFT-Marketplace/model"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"gorm.io/gorm"
)

func CreateNFT(nft *model.NFT, db *gorm.DB) error {
	if err := db.Create(nft).Error; err != nil {
		return err
	}
	return nil
}

func GetAllNFTs(db *gorm.DB) ([]model.NFT, error) {
	var nfts []model.NFT
	result := db.Find(&nfts)
	return nfts, result.Error
}

func GetAllListingsbyWallet(walletAddress string, db *gorm.DB) ([]model.NFT, error) {
	var nfts []model.NFT
	if err := db.Where("seller = ? AND is_listing = ?", walletAddress, true).Find(&nfts).Error; err != nil {
		return nil, err
	}
	return nfts, nil
}

func GetNFTswithWalletAddress(walletAddress string, db *gorm.DB) ([]model.NFT, error) {
	var nfts []model.NFT
	if err := db.Where("owner_of = ?", walletAddress).Find(&nfts).Error; err != nil {
		return nil, err
	}
	return nfts, nil
}

func GetNFTCountbyWallet(walletAddress string, db *gorm.DB) (int64, error) {
	var count int64
	if err := db.Model(&model.NFT{}).Where("owner_of = ?", walletAddress).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func GetNFTwithNftId(nftId string, db *gorm.DB) ([]model.NFT, error) {
	var nft []model.NFT
	if err := db.Where("id = ?", nftId).Find(&nft).Error; err != nil {
		return nil, err
	}
	return nft, nil
}

func GetNFTwithNftTokenAddress(tokenAddress string, db *gorm.DB) ([]model.NFT, error) {
	var nfts []model.NFT
	if err := db.Where("token_address = ?", tokenAddress).Find(&nfts).Error; err != nil {
		return nil, err
	}
	return nfts, nil
}

func GetNFTbyIsListing(isListing bool, db *gorm.DB) ([]model.NFT, error) {
	var nfts []model.NFT
	if err := db.Where("is_listing = ?", isListing).Find(&nfts).Error; err != nil {
		return nil, err
	}
	return nfts, nil
}

func UpdateNFT(nftId string, nft *model.NFT, db *gorm.DB) error {
	updates := map[string]interface{}{
		"TokenID":      nft.TokenID,
		"TokenAddress": nft.TokenAddress,
		"OwnerOf":      nft.OwnerOf,
		"Metadata":     nft.Metadata,
		"IsListing":    nft.IsListing,
		"Seller":       nft.Seller,
		"Price":        nft.Price,
	}
	result := db.Model(&model.NFT{}).Where("id = ?", nftId).Updates(updates)
	return result.Error
}

func FetchNFTData(walletAddress string, apiKey string, db *gorm.DB) ([]byte, error) {
	// Moralis API URL'sini oluşturun
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2/%s/nft?chain=avalanche&format=decimal", walletAddress)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// Gerekli header'ları ekle
	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", apiKey)

	// HTTP isteğini yap
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// Yanıttaki gövdeyi oku
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	// Yanıtı bir map olarak parse et
	var fullResult map[string]interface{}
	json.Unmarshal(body, &fullResult)

	// 'result' anahtarı içindeki verileri al, bir liste olduğunu varsayarak
	results, _ := fullResult["result"].([]interface{})
	filteredResults := make([]map[string]interface{}, 0)
	var nftsToSave []model.NFT

	// Her NFT için ilgili alanları ayıkla ve NFT model listesine ekle
	for _, item := range results {
		nftData, _ := item.(map[string]interface{})
		filtered := map[string]interface{}{
			"token_id":      nftData["token_id"],
			"token_address": nftData["token_address"],
			"owner_of":      nftData["owner_of"],
			"metadata":      nftData["metadata"],
		}
		filteredResults = append(filteredResults, filtered)

		nft := model.NFT{
			TokenID:      filtered["token_id"].(string),
			TokenAddress: filtered["token_address"].(string),
			OwnerOf:      filtered["owner_of"].(string),
			Metadata:     filtered["metadata"].(string),
		}
		nftsToSave = append(nftsToSave, nft)
	}

	// Veritabanına kaydet
	if err := SaveNFTs(nftsToSave, db); err != nil {
		return nil, err
	}

	// Filtrelenmiş veriyi JSON'a dönüştür
	filteredData, err := json.Marshal(filteredResults)
	if err != nil {
		return nil, err
	}

	return filteredData, nil
}

func SaveNFTs(nfts []model.NFT, db *gorm.DB) error {
	for _, nft := range nfts {
		// NFT'nin zaten var olup olmadığını kontrol et (token_id ve token_address kullanarak)
		var existingNFT model.NFT
		if err := db.Where("token_id = ? AND token_address = ?", nft.TokenID, nft.TokenAddress).First(&existingNFT).Error; err == nil {
			// NFT zaten varsa, güncelle
			db.Model(&existingNFT).Updates(nft)
		} else {
			// Yeni NFT, kaydet
			db.Create(&nft)
		}
	}
	return nil
}
