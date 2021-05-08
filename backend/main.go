package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// var client *mongo.Client
type CreateUser struct{
	ID        	primitive.ObjectID 		`bson:"_id,omitempty"`
	Username 	string					`bson:"username,omitempty" validate:"required,min=3,max=15"`
	Email		string					`bson:"email,omitempty" validate:"required,email"`
	Password 	string					`bson:"password,omitempty" validate:"required"`
	CreatedAt   time.Time          		`bson:"created_at"`
	UpdatedAt   time.Time          		`bson:"updated_at"`
}

type LoginUser struct{
	Email		string					`bson:"email,omitempty" validate:"required,email"`
	Password 	string					`bson:"password,omitempty" validate:"required"`
}
type ResponseResult struct{
	Error 		string 				`bson:"error"`
	Result		string				`bson:"result"`
}

type Claims struct {
	Email 		string 				`bson:"email"`
	jwt.StandardClaims
}

var clientInstance *mongo.Client
var clientInstanceError error
var mongoOnce sync.Once
var validate *validator.Validate

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}


func comparePasswords(hashedPwd string, plainPwd []byte) bool {
    byteHash := []byte(hashedPwd)
    err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
    if err != nil {
        log.Println(err)
        return false
    }
    return true
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

func findUser(email string) ([]CreateUser){
	client, _ := ConnectMongoClient()
	c := client.Database("GolangLogin").Collection("auth")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	result, err := c.Find(ctx, bson.M{"email":email})
	if err != nil {
		log.Fatal(err)
	}

	var episodes []CreateUser
	if err = result.All(ctx, &episodes); err != nil {
		log.Fatal(err)
	}

	return episodes

}

func login(res http.ResponseWriter, req *http.Request){
	validate = validator.New()
	res.Header().Set("content-type", "application/json")

	var user LoginUser
	var errors ResponseResult

	_ = json.NewDecoder(req.Body).Decode(&user)

	checkuser := findUser(user.Email)
	fmt.Print("user",user)
	if len(checkuser) == 0{
		errors.Error = "error"
		errors.Result = "No User"
		json.NewEncoder(res).Encode(errors)
		return
	}

	pwdMatch := comparePasswords(checkuser[0].Password, []byte(user.Password))

	if !pwdMatch{
		errors.Error = "error"
		errors.Result = "wrong password"
		json.NewEncoder(res).Encode(errors)
		return
	}
	
	err := validate.Struct(user)
	if err != nil {
		if _, ok := err.(*validator.InvalidValidationError); ok {
			return
		}

		for _, err := range err.(validator.ValidationErrors) {
				errors.Error = err.StructField()
				errors.Result = err.ActualTag()
				json.NewEncoder(res).Encode(errors)
				return
		}
	}


	mySigningKey := []byte("darunsant")
	expirationTime := time.Now().Add(5 * time.Minute)

	claims := &Claims{
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, _ := token.SignedString(mySigningKey)

	tokens := map[string]string{
		"access_token":  ss,
	}

	json.NewEncoder(res).Encode(tokens)
}


func addUser(res http.ResponseWriter, req *http.Request){

	validate = validator.New()

	res.Header().Set("content-type", "application/json")

	var user CreateUser
	var errors ResponseResult
	_ = json.NewDecoder(req.Body).Decode(&user)

	client, _ := ConnectMongoClient()
	c := client.Database("GolangLogin").Collection("auth")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	err := validate.Struct(user)
	if err != nil {
		if _, ok := err.(*validator.InvalidValidationError); ok {
			return
		}

		for _, err := range err.(validator.ValidationErrors) {
				errors.Error = err.StructField()
				errors.Result = err.ActualTag()
				json.NewEncoder(res).Encode(errors)
				return
		}
	}

	hash, _ := HashPassword(user.Password) 

	checkuser := findUser(user.Email)

	if len(checkuser) > 0{
		errors.Error = "error"
		errors.Result = "same email"
		json.NewEncoder(res).Encode(errors)
		return
	}
	user.Password = hash
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result,_ := c.InsertOne(ctx,user)

	json.NewEncoder(res).Encode(result)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/api/register",addUser).Methods("POST")
	router.HandleFunc("/api/login",login).Methods("POST")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000", "http://localhost:5000"})

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(router)))
}

