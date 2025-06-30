<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;

/**
 * Class OrderControllerTest
 *
 * @package Tests\Feature
 *
 * This class tests the OrderController functionality, including order placement,
 * validation of order totals, and payment processing.
 * 
 * You can run the tests using the command:
 * php artisan test --filter OrderControllerTest
 */
class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_order_placement()
    {
        $user = User::factory()->create();
        $payload = [
            'user_id' => $user->id,
            'items' => [
                [
                    'product_id' => 1,
                    'name' => 'Test Product',
                    'price' => 10.0,
                    'quantity' => 2
                ]
            ],
            'total' => 20.0,
            'payment_provider' => 'mockpay',
        ];

        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(201)
            ->assertJsonStructure([
                'order' => [
                    'id',
                    'user_id',
                    'items',
                    'total',
                    'status',
                    'created_at',
                    'updated_at'
                ],
                'payment' => [
                    'id',
                    'order_id',
                    'amount',
                    'provider',
                    'status',
                    'transaction_id',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function test_order_total_mismatch_returns_422()
    {
        $user = User::factory()->create();
        $payload = [
            'user_id' => $user->id,
            'items' => [
                [
                    'product_id' => 1,
                    'name' => 'Test Product',
                    'price' => 10.0,
                    'quantity' => 2
                ]
            ],
            'total' => 999.0, // Wrong total
            'payment_provider' => 'mockpay',
        ];

        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(422)
            ->assertJsonFragment(['error' => 'Total does not match sum of item prices.']);
    }

    public function test_payment_failure_rolls_back_order()
    {
        $user = User::factory()->create();
        $payload = [
            'user_id' => $user->id,
            'items' => [
                [
                    'product_id' => 1,
                    'name' => 'Test Product',
                    'price' => 10.0,
                    'quantity' => 2
                ]
            ],
            'total' => 20.0,
            'payment_provider' => 'fail',
        ];

        // Mock Payment::save() to throw exception
        $this->mock(Payment::class, function ($mock) {
            $mock->shouldReceive('save')->andThrow(new \Exception('Payment failed'));
        });

        $response = $this->postJson('/api/orders', $payload);
        $response->assertStatus(500)
            ->assertJsonFragment(['error' => 'Payment processing failed']);
        $this->assertDatabaseMissing('orders', ['user_id' => $user->id]);
    }
}
