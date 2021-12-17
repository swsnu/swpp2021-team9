from locust import HttpUser, between, task
from requests.auth import HTTPBasicAuth


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.signin()

    @task(1)
    def signin(self):
        response = self.client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"]

        response = self.client.post(
            "/api/user/signin/",
            json={"email": "test@test.com", "password": "testtest",},
            headers={"X-CSRFToken": csrftoken},
        )
        if response.status_code != 200:
            print(str(response.status_code) + " signin")

    @task(2)
    def get_combinations_main(self):
        res = self.client.get("/api/combination/main/")

        if res.status_code != 200:
            print(str(res.status_code) + "combination main")

