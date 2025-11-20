package vn.androidhaui.travelapp.repositories;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.androidhaui.travelapp.models.Tour;
import vn.androidhaui.travelapp.network.ApiClient;
import vn.androidhaui.travelapp.network.ApiResponse;
import vn.androidhaui.travelapp.network.ApiService;

public class AdminTourRepository {
    private final ApiService api;

    public AdminTourRepository(@NonNull Context context, @NonNull String baseUrl) {
        Retrofit retrofit = ApiClient.getClient(context, baseUrl);
        api = retrofit.create(ApiService.class);
    }

    public interface CallbackResult<T> {
        void onSuccess(T result);
        void onError(String error);
    }

    public void fetchTours(final CallbackResult<List<Tour>> cb) {
        api.getAdminTours().enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Tour>>> call, Response<ApiResponse<List<Tour>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    cb.onSuccess(response.body().getData());
                } else {
                    cb.onError(response.body() != null ? response.body().getMessage() : "Lỗi tải danh sách tour");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Tour>>> call, Throwable t) {
                Log.e("AdminTourRepo", "fetchTours", t);
                cb.onError(t.getMessage() != null ? t.getMessage() : "Lỗi mạng");
            }
        });
    }

    public void createTour(Map<String, Object> body, final CallbackResult<Tour> cb) {
        api.createAdminTour(body).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<ApiResponse<Tour>> call, Response<ApiResponse<Tour>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    cb.onSuccess(response.body().getData());
                } else {
                    cb.onError(response.body() != null ? response.body().getMessage() : "Lỗi tạo tour");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<Tour>> call, Throwable t) {
                cb.onError(t.getMessage() != null ? t.getMessage() : "Lỗi mạng");
            }
        });
    }

    public void updateTour(String id, Map<String, Object> body, final CallbackResult<Tour> cb) {
        api.updateAdminTour(id, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<ApiResponse<Tour>> call, Response<ApiResponse<Tour>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    cb.onSuccess(response.body().getData());
                } else {
                    cb.onError(response.body() != null ? response.body().getMessage() : "Lỗi cập nhật tour");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<Tour>> call, Throwable t) {
                cb.onError(t.getMessage() != null ? t.getMessage() : "Lỗi mạng");
            }
        });
    }

    public void deleteTour(String id, final CallbackResult<Void> cb) {
        api.deleteAdminTour(id).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    cb.onSuccess(null);
                } else {
                    cb.onError(response.body() != null ? response.body().getMessage() : "Lỗi xóa tour");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                cb.onError(t.getMessage() != null ? t.getMessage() : "Lỗi mạng");
            }
        });
    }

    public void searchTours(String query, final CallbackResult<List<Tour>> cb) {
        api.searchTours(query, null, null, null, null, null, null).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Tour>>> call, Response<ApiResponse<List<Tour>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    cb.onSuccess(response.body().getData());
                } else {
                    cb.onError(response.body() != null ? response.body().getMessage() : "Không tìm thấy tour phù hợp");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Tour>>> call, Throwable t) {
                cb.onError(t.getMessage() != null ? t.getMessage() : "Lỗi mạng");
            }
        });
    }
}
