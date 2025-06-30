<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
    public function scopeWithUserDetails($query)
    {
        return $query->with('user');
    }
    public function scopeWithPaymentDetails($query)
    {
        return $query->with('payments');
    }
    public function scopeWithItems($query)
    {
        return $query->select('id', 'user_id', 'total', 'status', 'items', 'created_at', 'updated_at');
    }
    public function getItemsAttribute($value)
    {
        return json_decode($value, true);
    }
}
