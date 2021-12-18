from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.signin()

    @task
    def signin(self):
        response = self.client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"]
        response = self.client.post(
            "/api/user/signin/",
            json={"email": "test@test.com", "password": "testtest"},
            headers={"X-CSRFToken": csrftoken},
        )
        if response.status_code != 200:
            print(str(response.status_code) + " signin")

    @task
    def get_combinations_main(self):
        res = self.client.get("/api/combination/main/")

        if res.status_code != 200:
            print(str(res.status_code) + "combination main")

    @task
    def get_specific_user(self):
        res = self.client.get("/api/user/info/2/")

    @task
    def get_instrument_list(self):
        res = self.client.get("/api/instrument/")

    @task
    def get_cover_list(self):
        res = self.client.get("/api/cover/1/")

    @task
    def get_cover_list_with_inst(self):
        res = self.client.get("/api/cover/1/1/")

    @task
    def get_specific_cover_info(self):
        res = self.client.get("/api/cover/info/2/")

    @task
    def get_cover_like(self):
        res = self.client.get("/api/cover/like/2/")

    @task
    def get_combination_list(self):
        res = self.client.get("/api/combination/2/")

    @task
    def get_combination_info(self):
        res = self.client.get("/api/combination/info/2/")

    @task
    def get_combination_like(self):
        res = self.client.get("/api/combination/like/2/")

    @task
    def get_song_list(self):
        res = self.client.get("/api/song/")

    @task
    def get_song_search_list(self):
        res = self.client.get("/api/song/search/?q=버스커")

    @task
    def get_specific_song(self):
        res = self.client.get("/api/song/info/1/")

