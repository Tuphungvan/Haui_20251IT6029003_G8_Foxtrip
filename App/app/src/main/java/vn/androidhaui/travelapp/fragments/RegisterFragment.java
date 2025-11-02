package vn.androidhaui.travelapp.fragments;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import vn.androidhaui.travelapp.MainActivity;
import vn.androidhaui.travelapp.databinding.FragmentRegisterBinding;
import vn.androidhaui.travelapp.viewmodels.AuthViewModel;

public class RegisterFragment extends Fragment {
    private FragmentRegisterBinding binding;
    private AuthViewModel viewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentRegisterBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(AuthViewModel.class);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        viewModel.getMessage().observe(getViewLifecycleOwner(), msg -> {
            if (msg != null && !msg.isEmpty())
                Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show();
        });

        binding.btnRegister.setOnClickListener(v -> {
            String username = binding.etUsername.getText() != null ? binding.etUsername.getText().toString().trim() : "";
            String email = binding.etEmail.getText() != null ? binding.etEmail.getText().toString().trim() : "";
            String password = binding.etPassword.getText() != null ? binding.etPassword.getText().toString().trim() : "";
            String confirm = binding.etConfirmPassword.getText() != null ? binding.etConfirmPassword.getText().toString().trim() : "";
            String phone = binding.etPhone.getText() != null ? binding.etPhone.getText().toString().trim() : "";
            String address = binding.etAddress.getText() != null ? binding.etAddress.getText().toString().trim() : "";

            if (TextUtils.isEmpty(username) || TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
                Toast.makeText(requireContext(), "Nhập đầy đủ thông tin", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!password.equals(confirm)) {
                Toast.makeText(requireContext(), "Mật khẩu không khớp", Toast.LENGTH_SHORT).show();
                return;
            }

            viewModel.register(username, email, password, phone, address);
        });

        binding.tvGoLogin.setOnClickListener(v -> {
            if (getActivity() instanceof MainActivity) {
                ((MainActivity) getActivity()).loadFragment(new LoginFragment(), false);
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}