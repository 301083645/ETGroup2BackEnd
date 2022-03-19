import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import store from "./store"
import { Provider } from "react-redux"
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,

} from "@apollo/client"

const defaultOptions = {
	watchQuery: {
		fetchPolicy: "no-cache",
		errorPolicy: "ignore"
	},
	query: {
		fetchPolicy: "no-cache",
		errorPolicy: "all"
	}
}

const client = new ApolloClient({
	uri: "http://localhost:5000/graphql/public",
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions
})

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<App />
			</Provider>
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
