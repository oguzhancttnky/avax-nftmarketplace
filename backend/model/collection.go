package model

import "gorm.io/gorm"

type Collection struct {
	gorm.Model            // Embedding gorm.Model to handle ID, CreatedAt, UpdatedAt, DeletedAt automatically
	Name                  string
	Symbol                string
	TokenAddress          string
	CollectionBannerImage string
	OwnerOf               string `gorm:"default:Unknown'"`
}
