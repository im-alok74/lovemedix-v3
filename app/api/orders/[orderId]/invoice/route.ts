import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requireRole } from '@/lib/auth-server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    let user
    try {
      user = await requireRole(['customer', 'pharmacy'])
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Fetch order
    const orderResult = await sql`
      SELECT 
        o.*,
        u.full_name as customer_full_name,
        u.phone as customer_phone,
        pp.pharmacy_name,
        pp.gst_number,
        pp.address as pharmacy_address,
        pp.city as pharmacy_city,
        pp.state as pharmacy_state,
        pp.pincode as pharmacy_pincode,
        pp.license_number,
        da.full_name as delivery_full_name,
        da.phone as delivery_phone,
        da.address_line1 as delivery_address_line1,
        da.address_line2 as delivery_address_line2,
        da.city as delivery_city,
        da.state as delivery_state,
        da.pincode as delivery_pincode
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
      JOIN addresses da ON o.delivery_address_id = da.id
      WHERE (o.order_number = ${params.orderId} OR o.id = ${Number(params.orderId) || 0})
      AND (o.customer_id = ${user.id} OR o.pharmacy_id IN (SELECT id FROM pharmacy_profiles WHERE user_id = ${user.id}))
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
        m.generic_name,
        m.hsn_code
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
            font-size: 12px;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
          }
          .logo-section {
            display: flex;
            align-items: center;
          }
          .logo {
            height: 50px;
            margin-right: 10px;
          }
          .lovemedix-title {
            font-size: 24px;
            font-weight: bold;
            color: #28a745; /* A green tone for LoveMedix */
          }
          .tax-invoice-text {
            font-size: 14px;
            color: #555;
            margin-top: 5px;
          }
          .order-info {
            text-align: right;
          }
          .order-info div {
            margin-bottom: 3px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 13px;
            text-transform: uppercase;
            color: #555;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f8f8f8;
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .text-right { text-align: right; }
          .summary {
            float: right;
            width: 300px;
            margin-left: 20px;
            border: 1px solid #eee;
            padding: 15px;
            background-color: #fcfcfc;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .summary-total {
            border-top: 1px solid #ddd;
            font-weight: bold;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 14px;
          }
          .seller-info, .buyer-info {
            float: left;
            width: 48%;
          }
          .seller-info {
            margin-right: 4%;
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
            font-size: 11px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo-section">
              <img src="/lovemedix-logo.jpg" alt="LoveMedix Logo" class="logo"/> <!-- Assuming logo is hosted in public folder -->
              <div>
                <div class="lovemedix-title">LoveMedix</div>
                <div class="tax-invoice-text">Tax Invoice</div>
              </div>
            </div>
            <div class="order-info">
              <div><strong>Order No:</strong> ${order.order_number}</div>
              <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</div>
              <div><strong>Status:</strong> ${order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}</div>
            </div>
          </div>

          <div class="section clearfix">
            <div class="seller-info">
              <div class="section-title">Sold By:</div>
              <div><strong>${order.pharmacy_name}</strong></div>
              <div>${order.pharmacy_address}</div>
              <div>${order.pharmacy_city}, ${order.pharmacy_state} - ${order.pharmacy_pincode}</div>
              <div style="margin-top: 10px;">
                <div><strong>License No:</strong> ${order.license_number}</div>
                <div><strong>GST No:</strong> ${order.gst_number}</div>
              </div>
            </div>
            <div class="buyer-info">
              <div class="section-title">Bill To:</div>
              <div><strong>${order.delivery_full_name}</strong></div>
              <div>Phone: ${order.delivery_phone}</div>
              <div>${order.delivery_address_line1}</div>
              ${order.delivery_address_line2 ? `<div>${order.delivery_address_line2}</div>` : ''}
              <div>${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}</div>
            </div>
          </div>

          <div style="clear: both;"></div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>HSN Code</th>
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
                  <td>${item.hsn_code || 'N/A'}</td>
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
