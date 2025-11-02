package vn.androidhaui.travelapp.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.List;
import java.util.Map;

import vn.androidhaui.travelapp.models.Tour;

public class AdminTourViewModel extends AndroidViewModel {
    private final AdminTourRepository repo;
    private final MutableLiveData<List<Tour>> tours = new MutableLiveData<>();
    private final MutableLiveData<String> message = new MutableLiveData<>();
    private final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    private final MutableLiveData<Tour> currentTour = new MutableLiveData<>();

    public AdminTourViewModel(@NonNull Application application) {
        super(application);
        String baseUrl = application.getApplicationContext().getString(vn.androidhaui.travelapp.R.string.base_url);
        repo = new AdminTourRepository(application.getApplicationContext(), baseUrl);
    }

    public LiveData<List<Tour>> getTours() { return tours; }
    public LiveData<String> getMessage() { return message; }
    public LiveData<Boolean> getLoading() { return loading; }
    public LiveData<Tour> getCurrentTour() { return currentTour; }

    public void loadTours() {
        loading.postValue(true);
        repo.fetchTours(new AdminTourRepository.CallbackResult<>() {
            @Override
            public void onSuccess(List<Tour> result) {
                loading.postValue(false);
                tours.postValue(result);
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
            }
        });
    }

    public void setCurrentTour(Tour t) {
        currentTour.postValue(t);
    }

    public void clearCurrentTour() {
        currentTour.postValue(null);
    }

    public void createTour(Map<String, Object> body) {
        loading.postValue(true);
        repo.createTour(body, new AdminTourRepository.CallbackResult<>() {
            @Override
            public void onSuccess(Tour result) {
                loading.postValue(false);
                // reload list
                loadTours();
                message.postValue("Tạo tour thành công");
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
            }
        });
    }

    public void updateTour(String id, Map<String, Object> body) {
        loading.postValue(true);
        repo.updateTour(id, body, new AdminTourRepository.CallbackResult<>() {
            @Override
            public void onSuccess(Tour result) {
                loading.postValue(false);
                loadTours();
                message.postValue("Cập nhật tour thành công");
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
            }
        });
    }

    public void deleteTour(String id) {
        loading.postValue(true);
        repo.deleteTour(id, new AdminTourRepository.CallbackResult<>() {
            @Override
            public void onSuccess(Void result) {
                loading.postValue(false);
                loadTours();
                message.postValue("Xóa tour thành công");
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
            }
        });
    }

    public void searchTours(String query) {
        loading.postValue(true);
        repo.searchTours(query, new AdminTourRepository.CallbackResult<>() {
            @Override
            public void onSuccess(List<Tour> result) {
                loading.postValue(false);
                tours.postValue(result);
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
            }
        });
    }


    public void clearMessage() { message.setValue(null); }
}
