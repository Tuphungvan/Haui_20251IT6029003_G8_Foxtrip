package vn.androidhaui.travelapp.fragments;

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import vn.androidhaui.travelapp.R;
import vn.androidhaui.travelapp.adapters.AdminUsersAdapter;
import vn.androidhaui.travelapp.databinding.FragmentAdminUsersBinding;
import vn.androidhaui.travelapp.models.User;
import vn.androidhaui.travelapp.viewmodels.AdminUserViewModel;

import java.util.List;

public class AdminUsersFragment extends Fragment implements AdminUsersAdapter.Listener {

    private FragmentAdminUsersBinding binding;
    private AdminUserViewModel viewModel;
    private AdminUsersAdapter adapter;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentAdminUsersBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        viewModel = new ViewModelProvider(requireActivity()).get(AdminUserViewModel.class);

        adapter = new AdminUsersAdapter(this);
        binding.recyclerUsers.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerUsers.setAdapter(adapter);

        ArrayAdapter<String> sortAdapter = new ArrayAdapter<>(
                requireContext(),
                R.layout.item_spinner_text, // layout hiển thị khi chưa mở dropdown
                new String[]{"Mặc định", "Tên ↑", "Tên ↓"}
        );
        sortAdapter.setDropDownViewResource(R.layout.item_spinner_dropdown);
        binding.spinSort.setAdapter(sortAdapter);

        binding.spinSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                triggerLoad();
            }
            @Override public void onNothingSelected(AdapterView<?> parent) {}
        });

        binding.edtSearch.setOnEditorActionListener((TextView v, int actionId, KeyEvent event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                triggerLoad();
                return true;
            }
            return false;
        });

        viewModel.getUsers().observe(getViewLifecycleOwner(), this::renderList);
        viewModel.getMessage().observe(getViewLifecycleOwner(), msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show();
                viewModel.clearMessage();
            }
        });
        viewModel.getLoading().observe(getViewLifecycleOwner(), loading ->
            binding.progressBar.setVisibility(loading != null && loading ? View.VISIBLE : View.GONE)
        );

        triggerLoad();
    }

    private void triggerLoad() {
        String search = binding.edtSearch.getText() != null ? binding.edtSearch.getText().toString().trim() : "";
        int pos = binding.spinSort.getSelectedItemPosition();
        String sort = (pos == 1 ? "asc" : pos == 2 ? "desc" : null);
        viewModel.loadUsers(search.isEmpty() ? null : search, sort);
    }

    private void renderList(List<User> list) {
        adapter.reloadData(list);
        binding.tvEmpty.setVisibility(list == null || list.isEmpty() ? View.VISIBLE : View.GONE);
    }

    @Override
    public void onActivate(User user) {
        viewModel.activateUser(user.getId());
    }

    @Override
    public void onDeactivate(User user) {
        viewModel.deactivateUser(user.getId());
    }

    @Override
    public void onResetPassword(User user) {
        viewModel.resetPassword(user.getId());
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
