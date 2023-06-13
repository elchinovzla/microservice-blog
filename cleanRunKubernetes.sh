kubectl delete -f infra/k8s/
## configure minikube for linux vm
eval $(minikube docker-env)
## build docker images
docker build -t elchinovzla/comments -f ./comments/Dockerfile ./comments
docker build -t elchinovzla/event-bus -f ./event-bus/Dockerfile ./event-bus
docker build -t elchinovzla/moderation -f ./moderation/Dockerfile ./moderation
docker build -t elchinovzla/posts -f ./posts/Dockerfile ./posts
docker build -t elchinovzla/query -f ./query/Dockerfile ./query
docker build -t elchinovzla/client -f ./client/Dockerfile ./client
## push docker images
docker push elchinovzla/comments
docker push elchinovzla/event-bus
docker push elchinovzla/moderation
docker push elchinovzla/posts
docker push elchinovzla/query
docker push elchinovzla/client
## run kubernetes
kubectl apply -f infra/k8s/