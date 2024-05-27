package service

/*
Burada Yaptığımız Handler ile gelen ve
düzeltilmiş HTTP isteğini kendi kodumuzda maniple etmek.
Burada DB e bağlanıp oradan çeşitli işlemler yapacağız.
*/

import (
	"Avax-NFT-Marketplace/model"
	"fmt"

	"gorm.io/gorm"
)

// Burada user modeli oluşturacağız.
func CreateUser(user *model.User, db *gorm.DB) error {
	err := db.Create(user)
	return err.Error
}

// Burada user modelini walletaddress'e göre alıp döndüreceğiz
func GetUserByWalletAddress(walletAddress string, db *gorm.DB) (*model.User, error) {
	var user model.User
	result := db.First(&user, "wallet_address = ?", walletAddress)
	return &user, result.Error
}

func GetUserByID(id uint, db *gorm.DB) (*model.User, error) {
	var user model.User                     // Bir user modeli (Java'da objesi) oluşturdum
	result := db.First(&user, "id = ?", id) // database de id si ? olan user ı bul ve user objesine ata dedim
	return &user, result.Error              // user modelini döndürdüm ve yanına error koydum (eğer hatasız ise nil döndürecek)
}

// Burada tüm kullanıcıları alıp döndüreceğiz
func GetAllUsers(db *gorm.DB) ([]model.User, error) {
	var users []model.User
	result := db.Find(&users)
	return users, result.Error
}

// Burada user modelini wallet address'e göre alıp güncelleyeceğiz
func UpdateUser(walletAddress string, user *model.User, db *gorm.DB) error {
	updates := make(map[string]interface{})
	fmt.Println(user)

	if user.Username != "" {
		updates["username"] = user.Username
	}
	if user.Email != nil && *user.Email != "" {
		updates["email"] = user.Email
	}
	if user.ProfileURL != nil && *user.ProfileURL != "" {
		updates["profile_url"] = user.ProfileURL
	}
	if user.TradedValue != 0 {
		updates["traded_value"] = user.TradedValue
	}
	result := db.Model(&model.User{}).Where("wallet_address = ?", walletAddress).Updates(updates)
	return result.Error
}

// Burada user modelini wallet address'e göre sileceğiz
func DeleteUser(walletAddress string, db *gorm.DB) error {
	result := db.Delete(&model.User{}, "wallet_address = ?", walletAddress)
	return result.Error
}
