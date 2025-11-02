package vn.androidhaui.travelapp.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

public class AdminCreateViewModel extends AndroidViewModel {

    private final AdminCreateRepository repo;
    private final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    private final MutableLiveData<String> message = new MutableLiveData<>();
    private final MutableLiveData<Boolean> success = new MutableLiveData<>(false);

    public AdminCreateViewModel(@NonNull Application application) {
        super(application);
        String baseUrl = application.getApplicationContext().getString(vn.androidhaui.travelapp.R.string.base_url);
        repo = new AdminCreateRepository(application.getApplicationContext(), baseUrl);
    }

    public LiveData<Boolean> getLoading() { return loading; }
    public LiveData<String> getMessage() { return message; }
    public LiveData<Boolean> getSuccess() { return success; }

    public void createAdmin(String username, String email, String password, String phone) {
        loading.postValue(true);
        repo.createAdmin(username, email, password, phone, new AdminCreateRepository.CallbackResult<>() {
            @Override
            public void onSuccess(String result) {
                loading.postValue(false);
                message.postValue(result);
                success.postValue(true);
            }

            @Override
            public void onError(String error) {
                loading.postValue(false);
                message.postValue(error);
                success.postValue(false);
            }
        });
    }

    public void clearMessage() { message.setValue(null); }
}
