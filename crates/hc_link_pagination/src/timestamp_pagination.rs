use hdk::prelude::*;
use crate::Timestamped;
use std::cmp::Reverse;

#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone)]
pub struct TimestampPagination {
    pub after_timestamp: Option<Timestamp>,
    pub direction: Option<SortDirection>,
    pub limit: usize,
}

#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone)]
pub enum SortDirection {
    Ascending,
    Descending,
}

pub fn get_by_timestamp_pagination<T>(
    items: Vec<T>,
    page: Option<TimestampPagination>,
) -> ExternResult<Vec<T>> 
where 
    T: Clone + Timestamped,
{
    let mut items_sorted = items.clone();

    match page {
        Some(TimestampPagination { after_timestamp, limit, direction }) => {
            // Sort items by timestamp() ascending or descending
            match direction {
                Some(d) => {
                    match d {
                        SortDirection::Descending => items_sorted.sort_by_key(|i| Reverse(i.timestamp())),
                        SortDirection::Ascending => items_sorted.sort_by_key(|i| i.timestamp()),
                    }
                },

                // Default to ascending
                None => items_sorted.sort_by_key(|i| i.timestamp())
            }
            
            // Determine start index for page slice
            let start_index = match after_timestamp {
                Some(timestamp) => {
                    match items_sorted.iter().position(|l| l.timestamp() == timestamp) {
                        Some(prev_position) => prev_position + 1,
                        None => 0
                    }
                }
                None => 0,
            };

            // Slice items into page by start index and limit
            let maybe_slice = match start_index+limit < items_sorted.len() {
                true => items_sorted.get(start_index..start_index+limit),
                false => items_sorted.get(start_index..items_sorted.len()),
            };

            match maybe_slice {
                Some(slice) => {
                    Ok(slice.to_vec())
                }
                None => Ok(vec![]),
            }
        }
        None => Ok(items_sorted),
    }
}
