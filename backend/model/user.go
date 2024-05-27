package model

import "gorm.io/gorm"

type User struct {
	gorm.Model            // Embedding gorm.Model to handle ID, CreatedAt, UpdatedAt, DeletedAt automatically
	WalletAddress string  `gorm:"uniqueIndex;not null"`
	Username      string  `gorm:"default:Unnamed'"`
	Email         *string `gorm:"uniqueIndex"`
	ProfileURL    *string
	TradedValue   float64 `gorm:"default:0"`
}
