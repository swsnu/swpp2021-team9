interface AsyncStateType<P> {
  loading: boolean = false;
  data?: P;
  error?: any;
}
