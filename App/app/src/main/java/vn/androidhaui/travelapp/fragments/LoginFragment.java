package vn.androidhaui.travelapp.fragments;

import android.content.Intent;
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

import vn.androidhaui.travelapp.AdminActivity;
import vn.androidhaui.travelapp.MainActivity;
import vn.androidhaui.travelapp.databinding.FragmentLoginBinding;
import vn.androidhaui.travelapp.viewmodels.AuthViewModel;

public class LoginFragment extends Fragment {
    private FragmentLoginBinding binding;
    private AuthViewModel viewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentLoginBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(requireActivity()).get(AuthViewModel.class);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        // observe
        viewModel.getUser().observe(getViewLifecycleOwner(), user -> {
            if (user == null) return;
            // nếu admin -> start AdminActivity riêng
            if (user.isAdmin()) {
                Intent intent = new Intent(requireActivity(), AdminActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                requireActivity().finish();
            } else {
                // non-admin -> show main UI
                if (getActivity() instanceof MainActivity) {
                    ((MainActivity) getActivity()).onLoginSuccess();
                }
            }
        });

        viewModel.getMessage().observe(getViewLifecycleOwner(), msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnLogin.setOnClickListener(v -> {
            String email = binding.etEmail.getText() != null ? binding.etEmail.getText().toString().trim() : "";
            String password = binding.etPassword.getText() != null ? binding.etPassword.getText().toString().trim() : "";

            if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
                Toast.makeText(requireContext(), "Nhập đầy đủ thông tin", Toast.LENGTH_SHORT).show();
                return;
            }
            viewModel.login(email, password);
        });

        binding.tvGoRegister.setOnClickListener(v -> {
            if (getActivity() instanceof MainActivity) {
                ((MainActivity) getActivity()).loadFragment(new RegisterFragment(), false);
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
