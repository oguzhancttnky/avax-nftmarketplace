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

func CreateCollection(collection *model.Collection, db *gorm.DB) error {
	if err := db.Create(collection).Error; err != nil {
		return err
	}
	return nil
}

func GetAllCollections(db *gorm.DB) ([]model.Collection, error) {
	var collections []model.Collection
	result := db.Find(&collections)
	return collections, result.Error
}

func GetAllCreators(db *gorm.DB) ([]model.Collection, error) {
	var collections []model.Collection
	if err := db.Where("owner_of != ?", "Unknown").Find(&collections).Error; err != nil {
		return nil, err
	}
	return collections, nil
}

func GetCollectionbyTokenAddress(tokenAddress string, db *gorm.DB) (*model.Collection, error) {
	var collection model.Collection
	result := db.First(&collection, "token_address = ?", tokenAddress)
	return &collection, result.Error
}

func GetAllCollectionsbyWallet(walletAddress string, db *gorm.DB) ([]model.Collection, error) {
	var collections []model.Collection
	if err := db.Where("owner_of = ?", walletAddress).Find(&collections).Error; err != nil {
		return nil, err
	}
	return collections, nil
}

func UpdateCollection(tokenAddress string, collection *model.Collection, db *gorm.DB) error {
	result := db.Model(&model.Collection{}).Where("token_address = ?", tokenAddress).Updates(collection)
	return result.Error
}

func DeleteCollection(tokenAddress string, db *gorm.DB) error {
	result := db.Delete(&model.Collection{}, "token_address = ?", tokenAddress)
	return result.Error
}

func FetchCollectionsData(walletAddress string, apiKey string, db *gorm.DB) ([]byte, error) {
	// Moralis API URL'sini oluşturun
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2/%s/nft/collections?chain=avalanche", walletAddress)
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
	var collectionsToSave []model.Collection

	// Her Collection için ilgili alanları ayıkla ve Collection model listesine ekle
	for _, item := range results {
		collectionData, _ := item.(map[string]interface{})
		_, ok := collectionData["collection_banner_image"].(string)
		if !ok {
			collectionData["collection_banner_image"] = ""
		}
		filtered := map[string]interface{}{
			"token_address":           collectionData["token_address"],
			"name":                    collectionData["name"],
			"symbol":                  collectionData["symbol"],
			"collection_banner_image": collectionData["collection_banner_image"],
		}
		filteredResults = append(filteredResults, filtered)

		collection := model.Collection{
			TokenAddress:          filtered["token_address"].(string),
			Name:                  filtered["name"].(string),
			Symbol:                filtered["symbol"].(string),
			CollectionBannerImage: filtered["collection_banner_image"].(string),
		}
		collectionsToSave = append(collectionsToSave, collection)
	}

	// Veritabanına kaydet
	if err := SaveCollections(collectionsToSave, db); err != nil {
		return nil, err
	}

	// Filtrelenmiş veriyi JSON'a dönüştür
	filteredData, err := json.Marshal(filteredResults)
	if err != nil {
		return nil, err
	}

	return filteredData, nil
}

func SaveCollections(collections []model.Collection, db *gorm.DB) error {
	for _, collection := range collections {
		// Collectionun zaten var olup olmadığını kontrol et (token_address kullanarak)
		var existingCollection model.Collection
		if err := db.Where("token_address = ?", collection.TokenAddress).First(&existingCollection).Error; err == nil {
			// Collection zaten varsa, güncelle
			db.Model(&existingCollection).Updates(collection)
		} else {
			// Yeni Collection, kaydet
			db.Create(&collection)
		}
	}
	return nil
}
