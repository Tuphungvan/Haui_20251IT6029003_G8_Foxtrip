package vn.androidhaui.travelapp.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import vn.androidhaui.travelapp.adapters.CartAdapter;
import vn.androidhaui.travelapp.databinding.FragmentCheckoutBinding;
import vn.androidhaui.travelapp.viewmodels.CheckoutViewModel;
import vn.androidhaui.travelapp.viewmodels.WalletViewModel;

public class CheckoutFragment extends Fragment {

    private FragmentCheckoutBinding binding;
    private WalletViewModel walletViewModel;
    private CheckoutViewModel viewModel;
    private CartAdapter adapter;

    public static CheckoutFragment newInstance() {
        return new CheckoutFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentCheckoutBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        String baseUrl = getString(vn.androidhaui.travelapp.R.string.base_url);
        viewModel = new ViewModelProvider(this,
                new CheckoutViewModel.Factory(requireContext(), baseUrl))
                .get(CheckoutViewModel.class);

        walletViewModel = new ViewModelProvider(requireActivity()).get(WalletViewModel.class);

        // Quan sát số dư ví
        walletViewModel.getBalance().observe(getViewLifecycleOwner(), balance -> {
            if (balance != null) {
                try {
                    double value = balance;
                    binding.tvWalletBalance.setText(String.format("Số dư: %,.0f VND", value));
                } catch (NumberFormatException e) {
                    binding.tvWalletBalance.setText("Số dư: " + balance + " VND");
                }
            }
        });

        walletViewModel.getMessage().observe(getViewLifecycleOwner(), msg -> {
            if (msg != null) {
                Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show();
                walletViewModel.clearMessage();
            }
        });

        walletViewModel.loadWallet();

        // Setup adapter giỏ hàng
        adapter = new CartAdapter(requireContext());
        adapter.setMode(CartAdapter.MODE_READONLY);
        binding.rvCheckoutItems.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvCheckoutItems.setAdapter(adapter);

        loadCheckout();

        // ✅ Đặt hàng (tạo nhiều orders)
        binding.btnPlaceOrder.setOnClickListener(v -> {
            String name = binding.etName.getText().toString().trim();
            String phone = binding.etPhone.getText().toString().trim();
            String address = binding.etAddress.getText().toString().trim();
            String email = binding.etEmail.getText().toString().trim();

            if (name.isEmpty() || phone.isEmpty() || address.isEmpty() || email.isEmpty()) {
                Toast.makeText(requireContext(), "Vui lòng nhập đủ thông tin bắt buộc", Toast.LENGTH_SHORT).show();
                return;
            }

            binding.pbLoading.setVisibility(View.VISIBLE);

            viewModel.getMessage().observe(getViewLifecycleOwner(), msg -> {
                if (msg != null && !msg.isEmpty()) {
                    Toast.makeText(requireContext(), msg, Toast.LENGTH_LONG).show();
                }
            });

            viewModel.placeOrder(name, phone, address, email).observe(getViewLifecycleOwner(), orderResponse -> {
                binding.pbLoading.setVisibility(View.GONE);
                if (orderResponse == null) {
                    return;
                }

                // ✅ Hiển thị thông báo cho nhiều orders
                String message;
                if ("Đã thanh toán và chờ xác nhận".equals(orderResponse.getStatus())) {
                    message = String.format("Đã tạo %d đơn hàng và thanh toán thành công",
                            orderResponse.getTotalOrders());
                } else {
                    message = String.format("Đã tạo %d đơn hàng, vui lòng thanh toán trong 24h",
                            orderResponse.getTotalOrders());
                }
                Toast.makeText(requireContext(), message, Toast.LENGTH_LONG).show();

                // Chuyển sang màn Orders
                requireActivity().getSupportFragmentManager()
                        .beginTransaction()
                        .replace(vn.androidhaui.travelapp.R.id.fragment_container, new OrdersFragment())
                        .addToBackStack(null)
                        .commit();
            });
        });

        binding.btnWalletUp.setOnClickListener(v -> requireActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(vn.androidhaui.travelapp.R.id.fragment_container, new RechargeWalletFragment())
                .addToBackStack(null)
                .commit());
    }

    private void loadCheckout() {
        binding.pbLoading.setVisibility(View.VISIBLE);
        viewModel.getCheckout().observe(getViewLifecycleOwner(), checkout -> {
            binding.pbLoading.setVisibility(View.GONE);
            if (checkout == null || checkout.getCart() == null || checkout.getCart().getItems() == null) {
                Toast.makeText(requireContext(), "Không thể tải thông tin giỏ hàng", Toast.LENGTH_SHORT).show();
                return;
            }

            binding.tvCheckoutItems.setText(
                    String.format("Số sản phẩm: %d", checkout.getCart().getItems().size()));
            binding.tvCheckoutTotal.setText(String.format("%,.0f VND", checkout.getTotal()));
            adapter.submitList(checkout.getCart().getItems());

            if (checkout.getUser() != null) {
                binding.etName.setText(checkout.getUser().getUsername());
                binding.etPhone.setText(checkout.getUser().getPhoneNumber());
                binding.etAddress.setText(checkout.getUser().getAddress());
                binding.etEmail.setText(checkout.getUser().getEmail());
            }
        });
    }

    @Override
    public void onDestroyView() {
        binding = null;
        super.onDestroyView();
    }
}