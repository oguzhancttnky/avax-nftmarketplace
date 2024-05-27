package model

import "gorm.io/gorm"

type NFT struct {
	gorm.Model   // Embedding gorm.Model to handle ID, CreatedAt, UpdatedAt, DeletedAt automatically
	TokenID      string
	TokenAddress string
	OwnerOf      string
	Metadata     string
	IsListing    bool `gorm:"default:false"`
	Seller       string
	Price        float64
}
