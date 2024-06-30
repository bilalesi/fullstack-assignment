# How long did you spend on the coding test?

I aimed to avoid over-engineering, as requested in the repo README, and focused on implementing only the necessary features.

Total time spent ~~ 5h35

Time spent on documentation and answering questions ~ 35min

# What would you add to your solution if you had more time? If you didn't spend much time on the coding test then use this as an opportunity to explain what you would add.

I will list what I should add more to the test if more time was spent, the list is order by priority:

1. **Testing** : Add more end-to-end (e2e) tests for both applications.

   1. The app has two tests for (fruits listing and offices listing) just to mimic what sould real applications must have.
2. **Backend Restructuring**:

   1. Refactor controllers to separate business logic (e.g., use repository pattern, use-cases, services).
   2. Split queries and mutations (commands).
   3. Create custom exceptions (errors).
   4. Add logging for better debugging.
3. **Data Validation** : Imporve data validation on both the client and server sides.

   1. In the frontend, data validation run on submit (it just my preference), another idea is to have onBlur validation (when user leave an input)
4. **UI Component Management** : (to be shared with different web apps if any, and also to create a reusable design system package)
5. **Shared Types Package** : Add a package for shared types to avoid re-declaration in both front-end and back-end.
6. **UI Library**: Integrate a UI library for more flexibility and pre-built components.
7. Handling Error better in the frontend.

# Describe your solution in plain english. Point out your design decisions and the reasoning behind them.

### Tech Stack

#### Backend

1. `Honojs`: it's web application framework similair to express, has the same mental model, it just fast and has some more builtin features as RPC communication, data validation.
2. `pg` postgres client to connect to db and manage connection pool, the client do not have any ORM on top to facilitate quering the db.
3. `zod` for data validation.
4. All endpoint share the same response format:

```ts
    {
    	message: string;
    	data: T
    }
```

5. the api entrypoint is `/api` with 3 different routes that handle:
   1. (query: `/api/common/*`) common endpoints (get-fruits, get-offices)
   2. (query `/api/report?office=x&year=y`) report (get-top-fruit, get-avg-consumption)
   3. (mutation `/api/purchase`) purchase endpoint

#### Frontend

1. `Nextjs` : React framework (actually can be used to manage the whole requirements/specifications of the test), a separate API service was used to adhere to the test's demands.
2. **No  `UI` library**: All the components are built using native elements, I tried to make it look nice and not inclide many functionalities for different components since it's not a requirement in the test.
3. The `UI` components is using `Atomic` design pattern (splitting the components to `atoms`, `molecules, organisms` ).
4. The app is communicating with the Restfull api service using  RPC provided by `Honojs`, so instead using `fetch` to query/mutate the backend, Hono is chaining the different parts of the path of the endpoint :

   ```ts
   fetch('/api/purchase', { method: 'post' }) 
   // it will be:
   client.api.purchase.$post() // using fetch under the hood
   ```

#### How it works

The design choices aim to create a maintainable and scalable solution while keeping the implementation straightforward and aligned with the test requirements.

The api service no using any architectural design pattern as clean architecture; the app too small to have it over structured/engineered, so I just have implemented the endpoint within the route implementation.

The web app is a `Nextjs app` , `Nextjs` is just my pick for this test. Leveraging file system navigation was one of the reasons to go with it. I choose to have 3 differents routes (home, report, purchase "instead of a modal").

The report page has a native form to select `office` and `year` , by submitting the form the request to fetch the `top-fruit` and `average consumption` server side.

The purchase page has a native form to select `office` and specify (fruit-quantity), the list of selected fruits is displayed in the same form, the user can delete items from the basket. submiting the form using server action to persist the purchase in the db.

# Have you learned something new doing this test? If yes, describe it here.

I have experienced using RPC-like framework using tRPC, or ts-rest before, but using it with Hono was a good experience due the simplicity, no overhead configuration, end-2-end typed.

# Describe yourself using JSON.

```json
{
	"name": "Bilal MEDDAH",
	"position": "TL-senior software engineer at BBP/EPFL, Switzerland",
	"age": 34,
	"degree": "master & engieer in computer systems",
	"skills": [
    		"javaScript/typeScript",
		"python",
    		"node.js, bun",
		"express, hono, nestjs",
    		"react",
    		"next.js",
    		"mongodb, postgres, redis",
		"sqlAlchemy, prisma, drizzleOrm, mongoose",
		"docker, K8s. Github, Gitlab",
    		"restfull-apis, graphql",
		"tailwind-css",
		"..."
  	],
	"interests": [
		"eng best practices",
		"distributed systems",
		"ai 🤷🏻"
	]
	"learning": [
		"golang",
		"qwikjs"
	],
	"life": [
		"books",
		"tv-series",
		"running",
		"walking",
		"traveling"
	]
}
```
