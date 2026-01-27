import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.user_type !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch order
    const orderResult = await sql`
      SELECT 
        o.*,
        u.full_name,
        u.phone,
        pp.pharmacy_name,
        pp.gst_number,
        pp.address,
        pp.city,
        pp.state,
        pp.pincode,
        pp.license_number
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
      WHERE (o.order_number = ${params.orderId} OR o.id = ${Number(params.orderId) || 0})
      AND o.customer_id = ${user.id}
      LIMIT 1
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult[0] as any

    // Fetch order items
    const items = await sql`
      SELECT 
        oi.*,
        m.name,
        m.generic_name
      FROM order_items oi
      JOIN medicines m ON oi.medicine_id = m.id
      WHERE oi.order_id = ${order.id}
    `

    const gst = order.subtotal * 0.05

    // Generate HTML invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${order.order_number}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .logo { font-size: 24px; font-weight: bold; color: #008000; }
          .order-info { text-align: right; }
          .section {
            margin-bottom: 20px;
          }
          .section-title { font-weight: bold; margin-bottom: 10px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f5f5f5;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #000;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .text-right { text-align: right; }
          .summary {
            float: right;
            width: 300px;
            margin-left: 20px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .summary-total {
            border-top: 2px solid #000;
            font-weight: bold;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 18px;
          }
          .seller-info, .buyer-info {
            float: left;
            width: 45%;
          }
          .seller-info {
            margin-right: 10%;
          }
          .clearfix::after {
            content: "";
            display: table;
            clear: both;
          }
          .footer {
            clear: both;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div>
              <div class="logo">LoveMedix</div>
              <div>Tax Invoice</div>
            </div>
            <div class="order-info">
              <div><strong>Order No:</strong> ${order.order_number}</div>
              <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <div class="section clearfix">
            <div class="seller-info">
              <div class="section-title">Sold By:</div>
              <div><strong>${order.pharmacy_name}</strong></div>
              <div>${order.address}</div>
              <div>${order.city}, ${order.state} - ${order.pincode}</div>
              <div style="margin-top: 10px;">
                <div><strong>License:</strong> ${order.license_number}</div>
                <div><strong>GST:</strong> ${order.gst_number}</div>
              </div>
            </div>
            <div class="buyer-info">
              <div class="section-title">Bill To:</div>
              <div><strong>${order.full_name}</strong></div>
              <div>Phone: ${order.phone}</div>
            </div>
          </div>

          <div style="clear: both;"></div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(items as any[])
                .map(
                  (item) => `
                <tr>
                  <td>
                    <strong>${item.name}</strong><br>
                    <small>${item.generic_name}</small>
                  </td>
                  <td>${item.quantity}</td>
                  <td class="text-right">₹${Number(item.unit_price).toFixed(2)}</td>
                  <td class="text-right">
                    ${item.discount_percentage > 0 ? `₹${(Number(item.unit_price) * item.quantity * item.discount_percentage / 100).toFixed(2)}` : '-'}
                  </td>
                  <td class="text-right">₹${Number(item.total_price).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal (Before GST):</span>
              <span>₹${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>GST (5%):</span>
              <span>₹${gst.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Charge:</span>
              <span>${order.delivery_charge === 0 ? 'FREE' : `₹${Number(order.delivery_charge).toFixed(2)}`}</span>
            </div>
            <div class="summary-row summary-total">
              <span>Total Amount:</span>
              <span>₹${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated invoice</p>
            <p>For queries, contact support@lovemedix.com</p>
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Return as HTML that can be printed or converted to PDF
    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="Invoice_${order.order_number}.html"`
      }
    })
  } catch (error) {
    console.error('[v0] Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
