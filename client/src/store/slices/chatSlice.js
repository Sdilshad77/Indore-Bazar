import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const askAI = createAsyncThunk(
  "chat/ask",
  async (question, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/chat", { question });
      return { question, answer: data.message };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "AI is unavailable right now");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(askAI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          from: "user",
          text: action.payload.question,
        });
        state.messages.push({
          from: "ai",
          text: action.payload.answer,
        });
      })
      .addCase(askAI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messages.push({
          from: "ai",
          text: action.payload || "Something went wrong. Please try again.",
        });
      });
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;