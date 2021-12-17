from locust import HttpUser, between, task
from requests.auth import HTTPBasicAuth


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.signin()

    @task(1)
    def signin(self):
        # res = self.client.get("/api/token/")
        # csrftoken = res.cookies["csrftoken"]

        # res = self.client.post(
        #     "/api/user/sigin/",
        #     json={
        #         "email": "test@test.com",
        #         "password": "testtest",
        #         "csrfmiddlewaretoken": csrftoken,
        #     },
        #     headers={"X-CSRFToken": csrftoken},
        # )
        # if res.status_code != 200:
        #     print(str(res.status_code) + " signin")
        self.client.auth = HTTPBasicAuth("username", "password")

    @task(2)
    def get_combinations_main(self):
        res = self.client.get("/api/combination/main/")

        if res.status_code != 200:
            print(str(res.status_code) + "combination main")

