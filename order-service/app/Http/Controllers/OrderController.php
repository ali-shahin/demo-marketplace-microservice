<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'payment_provider' => 'required|string',
        ]);

        // Advanced validation: Ensure total matches sum of item prices * quantities
        $calculatedTotal = 0;
        foreach ($validated['items'] as $item) {
            $mockPrice = $item['price'];
            $calculatedTotal += $mockPrice * $item['quantity'];
        }
        // Allow a small float tolerance
        if (abs($calculatedTotal - $validated['total']) > 0.01) {
            return response()->json([
                'error' => 'Total does not match sum of item prices.'
            ], 422);
        }

        try {
            $order = new \App\Models\Order();
            $order->user_id = $validated['user_id'];
            $order->items = json_encode($validated['items']);
            $order->total = $validated['total'];
            $order->status = 'pending';
            $order->save();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Order creation failed', 'details' => $e->getMessage()], 500);
        }

        try {
            $payment = new Payment();
            $payment->order_id = $order->id;
            $payment->amount = $order->total;
            $payment->provider = $validated['payment_provider'];
            $payment->status = 'completed';
            $payment->transaction_id = uniqid('txn_');
            $payment->save();
        } catch (\Exception $e) {
            // Optionally, rollback order if payment fails
            $order->delete();
            return response()->json(['error' => 'Payment processing failed', 'details' => $e->getMessage()], 500);
        }

        return response()->json([
            'order' => $order,
            'payment' => $payment
        ], 201);
    }
}
