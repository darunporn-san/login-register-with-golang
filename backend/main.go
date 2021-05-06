package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// var client *mongo.Client
type Authentication struct{
	ID        	primitive.ObjectID 		`bson:"_id,omitempty"`
	Username 	string					`bson:"username,omitempty"`
	Email		string					`bson:"email,omitempty"`
	Password 	string					`bson:"password,omitempty"`
	CreatedAt   time.Time          		`bson:"created_at"`
	UpdatedAt   time.Time          		`bson:"updated_at"`

}
var clientInstance *mongo.Client
var clientInstanceError error
var mongoOnce sync.Once

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}


func ConnectMongoClient() (*mongo.Client,error){
	mongoOnce.Do(func() {
		clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

		// Connect to MongoDB
		client, err := mongo.Connect(context.TODO(), clientOptions)
	
		if err != nil {
			clientInstanceError = err
		}
		// Check the connection
		err = client.Ping(context.TODO(), nil)
	
		if err != nil {
			clientInstanceError = err
		}
	
		clientInstance = client
		fmt.Println("Connected to MongoDB!")
	})
	return clientInstance,clientInstanceError
}

func login(res http.ResponseWriter, req *http.Request){
	res.Header().Set("content-type", "application/json")
	var user Authentication
	_ = json.NewDecoder(req.Body).Decode(&user)

	client, _ := ConnectMongoClient()
	c := client.Database("GolangLogin").Collection("auth")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	result, err := c.Find(ctx, bson.M{"username":"mint"})
	if err != nil {
		log.Fatal(err)
	}
	var episodes []bson.M
	if err = result.All(ctx, &episodes); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(res).Encode(episodes)
}
func addUser(res http.ResponseWriter, req *http.Request){
	res.Header().Set("content-type", "application/json")
	var user Authentication
	_ = json.NewDecoder(req.Body).Decode(&user)

	client, _ := ConnectMongoClient()
	c := client.Database("GolangLogin").Collection("auth")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	hash, _ := HashPassword(user.Password) 

	user.Password = hash
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result,_ := c.InsertOne(ctx,user)

	json.NewEncoder(res).Encode(result)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/register",addUser).Methods("POST")
	router.HandleFunc("/login",login).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080",router))
}

