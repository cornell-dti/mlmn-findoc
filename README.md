# Millennium Project for FinDoc

## Contributors

- Alisha Lin (PM)
- Tucker Stanley (Dev)
- Elizabeth Tang (Dev)
- Pratyush Sudhakar (Dev)
- Lily Pham (Dev)
- Oscar Wang (Dev)
- Alyssa Zhang (Dev)
- Patricia Huang (Dev)
- Jasmine Li (Dev)
- Helen Lei (Dev)

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/cornell-dti/mlmn-findoc.git
   ```

2. CD into the repository

   ```bash
   cd mlmn-findoc
   ```

3. Put the `.env` file in the root directory of the repository

### Setting up Backend

1. Create a virtual environment in the root directory

   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment

   ```bash
   source venv/bin/activate
   ```

3. Install the dependencies
   ```bash
   pip install -r requirements.txt
   ```
4. Put the `credentials.json` file in the `backend` directory

### Setting up Frontend

1. CD into the frontend directory

   ```bash
   cd frontend
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

3. Put the `.env.local` file in the `frontend` directory

## Running the App

### Running the frontend

1. CD into the frontend directory

   ```bash
   cd frontend
   ```

2. Run the frontend

   ```bash
    npm run dev
   ```

The frontend should now be running on `localhost:3000`

### Running the backend

1. CD into the `backend` directory

   ```bash
   cd backend
   ```

2. Run the backend

   ```bash
   python server.py
   ```

The server should now be running on `localhost:8080`
