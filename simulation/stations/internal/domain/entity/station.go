package entity

import (
	"math"
	"math/rand"
	"time"
)

type StationRepository interface {
	FindAllStations() ([]*Station, error)
}

type Station struct {
	ID        string                 `json:"_id"`
	Latitude  float64                `json:"latitude"`
	Longitude float64                `json:"longitude"`
	Params    map[string]interface{} `json:"params"`
}

type StationPayload struct {
	ID           string  `json:"id"`
	MaxCapacity  float64 `json:"max_capacity"`
	BatteryLevel float64 `json:"battery_level"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}

func Entropy(min float64, max float64) float64 {
	rand.NewSource(time.Now().UnixNano())
	return math.Round(float64(rand.Float64()*(max-min) + min))
}

func NewStationPayload(id string, params map[string]interface{}, latitude float64, longitude float64) (*StationPayload, error) {
	min, ok := params["min"].(float64)
	if !ok {
		panic("min value not found or not a float64")
	}
	max, ok := params["max"].(float64)
	if !ok {
		panic("max value not found or not a float64")
	}

	value := Entropy(min, max)
	percent := (value - min) / (max - min) * 100

	return &StationPayload{
		ID:           id,
		MaxCapacity:  max,
		BatteryLevel: percent,
		Latitude:     latitude,
		Longitude:    longitude,
	}, nil
}
