import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '../../types';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode('17be3477599fd243db976ea71d39490839051b0278462de79a21e07e7723eb0c95d68763e1884b2156626aa9604d612e7cfdc7202b3da107953d3adc8771534203a2fed405610d3c9602fb910ce62543293c57b4fcd9845b152bf3728adbe2be7952d509e9f10a281fa4cbf1b99017356a2a013ff869996ae769d6537f16f24e');

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    console.log('Logging in with credentials:', credentials);
    const response = await axios.get(`http://localhost:3001/users?email=${credentials.email}`);
    const user = response.data[0];
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    console.log('Generated token:', token);

    return { user, token };
  }
);

export const loginWithToken = createAsyncThunk(
  'auth/loginWithToken',
  async (token: string) => {
    console.log('Verifying token:', token);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const response = await axios.get(`http://localhost:3001/users?id=${userId}`);
    const user = response.data[0];

    if (!user) {
      throw new Error('Invalid token');
    }

    return { user, token };
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(loginWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Token validation failed';
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;