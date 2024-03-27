import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  getOneDreamReviews(dreamId: number): Observable<any> {
    return this.http.get(`/api/dreams/${dreamId}/reviews`);
  }

  addReview(review: any): Observable<any> {
    const id = +review.dreamId;
    return this.http.post(`/api/dreams/${id}/reviews`, review, { params: { user: review.userId } });
  }
}