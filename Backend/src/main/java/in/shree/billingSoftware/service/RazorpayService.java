package in.shree.billingSoftware.service;
import com.razorpay.RazorpayException;
import in.shree.billingSoftware.io.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
